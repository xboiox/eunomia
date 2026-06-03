import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { hasMinimumTenantRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma/client";
import { EditAssessmentForm } from "@/components/assessments/EditAssessmentForm";

interface PageProps {
  params: Promise<{ assessmentId: string }>;
}

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  // Render as yyyy-mm-dd in local time for <input type="date">
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}

export default async function EditAssessmentPage({ params }: PageProps) {
  const session = await getAuthSession();
  if (!session) redirect("/signin");

  const { assessmentId } = await params;
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { framework: { select: { name: true, version: true } }, tenant: { select: { name: true } } },
  });
  if (!assessment) notFound();

  const canManage = await hasMinimumTenantRole(session.userId, assessment.tenantId, "ADMIN");
  if (!canManage) redirect(`/dashboard/assessments/${assessmentId}`);

  return (
    <div className="p-8">
      <Link
        href={`/dashboard/assessments/${assessmentId}`}
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to assessment
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Edit Assessment</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Update the assessment name, description, and deadline. Organization and framework cannot be
        changed after creation.
      </p>

      <EditAssessmentForm
        assessmentId={assessment.id}
        initial={{
          name: assessment.name,
          description: assessment.description ?? "",
          overallDeadline: toDateInputValue(assessment.overallDeadline),
        }}
        frameworkLabel={`${assessment.framework.name}${
          assessment.framework.version ? ` (${assessment.framework.version})` : ""
        }`}
        tenantName={assessment.tenant.name}
      />
    </div>
  );
}
