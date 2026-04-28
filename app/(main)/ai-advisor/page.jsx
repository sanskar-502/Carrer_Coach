import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import AIAdvisorView from "./_components/ai-advisor-view";

export const metadata = {
  title: "AI Career Advisor | AI Career Catalyst",
  description:
    "Chat with an AI career advisor powered by RAG and LangChain. Upload your resume for personalized guidance.",
};

export default async function AIAdvisorPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto">
      <AIAdvisorView />
    </div>
  );
}
