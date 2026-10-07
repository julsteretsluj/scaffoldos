import { SafetyPlansClient } from "./safety-plans-client";

/** Avoid build-time prerender; personId comes from the request, not useSearchParams. */
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ personId?: string }>;
};

export default async function SafetyPlansPage({ searchParams }: Props) {
  const { personId } = await searchParams;
  return <SafetyPlansClient initialPersonId={personId ?? ""} />;
}
