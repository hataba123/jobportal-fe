import CategoryJobsPage from "@/components/category/CategoryJobsPage";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryJobsPage categoryId={params.id} />;
} 