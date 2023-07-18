import DetailsCard from "./details-card";

export interface Props {
  fields: { name: string; data: string }[];
}

export default ({ fields }: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-3 py-6">
    {fields.map((field) => (
      <div key={field.name} className="flex items-center flex-col">
        <DetailsCard data={field.data} name={field.name} />
      </div>
    ))}
  </div>
);
