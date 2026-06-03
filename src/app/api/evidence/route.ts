import { type NextRequest } from "next/server";

import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { getAuthSession } from "@/lib/auth/session";
import { saveEvidenceFile } from "@/lib/evidence/storage";
import { validateEvidenceFile } from "@/lib/evidence/validate";
import { prisma } from "@/lib/prisma/client";
import { err, ok } from "@/lib/utils/api";

// POST /api/evidence — multipart upload of an evidence file for a control.
// Form fields: file, assessmentId, controlId.
export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return err("Unauthorized", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return err("Invalid multipart form data", 400);
  }

  const file = form.get("file");
  const assessmentId = form.get("assessmentId");
  const controlId = form.get("controlId");

  if (!(file instanceof File)) return err("A file is required", 400);
  if (typeof assessmentId !== "string" || typeof controlId !== "string") {
    return err("assessmentId and controlId are required", 400);
  }

  const validation = validateEvidenceFile({
    name: file.name,
    size: file.size,
    type: file.type,
  });
  if (!validation.ok) return err(validation.error, 422);

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { tenantId: true },
  });
  if (!assessment) return err("Assessment not found", 404);

  const canAccess = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ASSESSOR");
  if (!canAccess) return err("Forbidden", 403);

  const response = await prisma.controlResponse.findUnique({
    where: { assessmentId_controlId: { assessmentId, controlId } },
    select: { id: true },
  });
  if (!response) return err("Control response not found for this assessment", 404);

  const bytes = Buffer.from(await file.arrayBuffer());
  const saved = await saveEvidenceFile({
    tenantId: assessment.tenantId,
    assessmentId,
    controlId,
    fileName: file.name,
    bytes,
  });

  const evidence = await prisma.evidence.create({
    data: {
      controlResponseId: response.id,
      fileName: file.name,
      filePath: saved.relativePath,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
      uploadedById: session.userId,
    },
  });

  return ok(evidence, 201);
}
