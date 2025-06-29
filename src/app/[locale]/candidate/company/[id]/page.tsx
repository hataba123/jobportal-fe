import CompanyDetailPage from "@/components/company/CompanyDetailPage";

interface CompanyPageProps {
  params: {
    id: string;
  };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  return <CompanyDetailPage companyId={params.id} />;
} 