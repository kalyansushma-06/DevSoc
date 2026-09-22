import JoinForm from "@/components/JoinForm";

export const metadata = { title: "Join — DevSoc" };

export default function JoinPage() {
  return (
    <div className="section max-w-3xl">
      <span className="eyebrow">Recruitment</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Join DevSoc</h1>
      <p className="mt-6 text-white/60">
        No experience required. Tell us a bit about yourself and pick the sub-team that fits —
        Tech, Design, Content, or Management. Applications are reviewed by that team's coordinator.
      </p>

      <div className="mt-10">
        <JoinForm />
      </div>
    </div>
  );
}
