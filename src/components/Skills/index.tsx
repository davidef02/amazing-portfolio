import config from "@payload-config";
import { getPayload } from "payload";

export default async function Skills() {
  const payload = await getPayload({ config });
  const { docs: skills } = await payload.find({
    collection: "skills",
    limit: 100,
    select: { title: true, description: true },
  });

  return (
    <div>
      {skills.map((s) => (
        <div key={s.id}>{s.title}</div>
      ))}
    </div>
  );
}
