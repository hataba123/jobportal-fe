import JobDetailPage from "@/components/job/JobDetailPage";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  return <JobDetailPage jobId={id} />;
} 
