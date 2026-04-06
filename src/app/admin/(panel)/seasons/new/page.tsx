import { AdminFormField } from "@/components/admin/AdminFormField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { createSeason } from "@/app/admin/_actions/seasons";

export const metadata = { title: "Admin — New Season" };

export default function NewSeasonPage() {
  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10 max-w-2xl">
      <h1 className="font-display text-[2rem] font-light text-cream leading-none mb-8">
        New Season
      </h1>

      <form action={createSeason} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <AdminFormField label="Number" name="number">
            <input
              id="number"
              name="number"
              type="number"
              min={1}
              required
              className="form-input"
            />
          </AdminFormField>
          <AdminFormField label="Numeral" name="numeral" hint="e.g. I, II, III">
            <input id="numeral" name="numeral" type="text" className="form-input" />
          </AdminFormField>
        </div>

        <AdminFormField label="Title" name="title">
          <input id="title" name="title" type="text" required className="form-input" />
        </AdminFormField>

        <AdminFormField label="Subtitle" name="subtitle">
          <input id="subtitle" name="subtitle" type="text" className="form-input" />
        </AdminFormField>

        <AdminFormField label="Slug" name="slug" hint="URL-safe identifier, e.g. season-1">
          <input id="slug" name="slug" type="text" required className="form-input" />
        </AdminFormField>

        <AdminFormField label="Status" name="status">
          <select id="status" name="status" required className="form-input">
            <option value="upcoming">Upcoming</option>
            <option value="airing">Airing</option>
            <option value="complete">Complete</option>
          </select>
        </AdminFormField>

        <AdminFormField label="Description" name="description">
          <textarea id="description" name="description" rows={4} className="form-input" />
        </AdminFormField>

        <AdminFormField label="Featured Image" name="image_file">
          <ImageUploadField />
        </AdminFormField>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity hover:opacity-80"
          >
            Create Season
          </button>
          <a
            href="/admin/seasons"
            className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-cream-dim hover:text-cream transition-colors no-underline px-6 py-3"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
