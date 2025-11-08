import { fetchTestRuns, fetchTestSuites } from "../../lib/api";
import TestRunsClient from "../../components/TestRunsClient";

export default async function TestRunsPage() {
  const [initialRuns, suites] = await Promise.all([fetchTestRuns({ limit: 20 }), fetchTestSuites()]);
  return <TestRunsClient initialRuns={initialRuns} suites={suites} />;
}
