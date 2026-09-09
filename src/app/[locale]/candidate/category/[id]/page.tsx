import CategoryJobsPage from "@/components/category/CategoryJobsPage";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  return <CategoryJobsPage categoryId={id} />;
} 
