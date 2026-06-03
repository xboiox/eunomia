import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { ControlResponseForm } from "@/components/assessments/ControlResponseForm";
import { MaturityTable } from "@/components/assessments/MaturityTable";
import { ImplementationExamples } from "@/components/assessments/ImplementationExamples";
import { EvidencePanel } from "@/components/evidence/EvidencePanel";

interface PageProps {
  params: Promise<{ assessmentId: string; controlId: string }>;
}

export default async function ControlResponsePage({ params }: PageProps) {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const { assessmentId, controlId } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { framework: { select: { code: true, name: true } } },
  });
  if (!assessment) notFound();

  const canAccess = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ASSESSOR");
  if (!canAccess) redirect("/dashboard/assessments");

  const [control, response] = await Promise.all([
    prisma.control.findUnique({
      where: { id: controlId },
      include: { domain: { select: { code: true, name: true } } },
    }),
    prisma.controlResponse.findUnique({
      where: { assessmentId_controlId: { assessmentId, controlId } },
      include: {
        lastUpdatedBy: { select: { name: true, email: true } },
        evidences: { orderBy: { uploadedAt: "asc" } },
      },
    }),
  ]);
  if (!control) notFound();

  const isNist = assessment.framework.code === "NIST_CSF";

  // Safe-cast maturityCriteria from Prisma's JsonValue to our typed shape.
  type MaturityCriteria = { "1": string; "2": string; "3": string; "4": string; "5": string };
  const maturityCriteria =
    isNist && control.maturityCriteria != null
      ? (control.maturityCriteria as MaturityCriteria)
      : null;

  return (
    <div className="p-8">
      <Link
        href={`/dashboard/assessments/${assessmentId}`}
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← {assessment.name}
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">{control.code}</span>
        <span className="text-xs text-gray-400">{control.domain.code} · {control.domain.name}</span>
      </div>
      <h1 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{control.name}</h1>
      {control.description && (
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-300">{control.description}</p>
      )}
      {control.guidance && (
        <div className="mt-3 max-w-3xl rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
          <span className="font-medium">Guidance: </span>{control.guidance}
        </div>
      )}

      {maturityCriteria && (
        <MaturityTable
          criteria={maturityCriteria}
          currentLevel={response?.maturityLevel ?? null}
        />
      )}

      {isNist && control.implementationExamples && (
        <ImplementationExamples text={control.implementationExamples} />
      )}

      <ControlResponseForm
        assessmentId={assessmentId}
        controlId={controlId}
        isNist={isNist}
        initial={{
          status: response?.status ?? "NOT_STARTED",
          maturityLevel: response?.maturityLevel ?? null,
          notes: response?.notes ?? "",
          deadline: response?.deadline ? response.deadline.toISOString().slice(0, 10) : "",
        }}
        lastUpdatedBy={response?.lastUpdatedBy?.name ?? response?.lastUpdatedBy?.email ?? null}
        updatedAt={response?.updatedAt ? response.updatedAt.toLocaleString() : null}
      />

      <EvidencePanel
        assessmentId={assessmentId}
        controlId={controlId}
        initialEvidences={(response?.evidences ?? []).map((e) => ({
          id: e.id,
          fileName: e.fileName,
          fileSize: e.fileSize,
          uploadedAt: e.uploadedAt.toISOString(),
        }))}
      />
    </div>
  );
}
