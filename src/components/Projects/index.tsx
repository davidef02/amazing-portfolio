import config from "@payload-config";
import { getPayload } from "payload";
import { SectionHeading } from "@/components/SectionHeading";
import ProjectCard from "./project-card";

export default async function Projects() {
  const payload = await getPayload({ config });
  const { docs: projects } = await payload.find({
    collection: "projects",
    limit: 100,
    depth: 1,
    where: { _status: { equals: "published" } },
  });

  return (
    <div>
      <SectionHeading num="02" title="Projects">
        <span className="rounded-base border-2 border-black bg-hot-pink px-2.5 py-1 font-mono text-xs font-bold">
          click a card to flip it ↓
        </span>
      </SectionHeading>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-7 gap-y-9">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}
