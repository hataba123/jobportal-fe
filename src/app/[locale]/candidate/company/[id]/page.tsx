import CompanyDetailPage from "@/components/company/CompanyDetailPage";

interface CompanyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  return <CompanyDetailPage companyId={id} />;
} 
