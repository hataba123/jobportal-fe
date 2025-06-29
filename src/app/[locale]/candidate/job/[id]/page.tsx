import JobDetailPage from "@/components/job/JobDetailPage";

interface JobPageProps {
  params: {
    id: string;
  };
}

export default function JobPage({ params }: JobPageProps) {
  return <JobDetailPage jobId={params.id} />;
} 