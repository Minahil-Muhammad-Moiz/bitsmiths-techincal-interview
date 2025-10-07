import Table, { Issue } from "./components/table";
import issuesData from "./constants/issues.json";

export default function Home() {
  // Normalize the data to strictly match the Issue type.
  const issues: Issue[] = Array.isArray(issuesData)
    ? issuesData.map((issue) => ({
        ...issue,
        // Coerce status safely to the expected union type
        status: issue.status === "resolved" ? "resolved" : "open",
      }))
    : [];

  return (
    <main className="p-4">
      <Table issues={issues} />
    </main>
  );
}
