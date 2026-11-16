import { error } from '@sveltejs/kit';
import { groups, groupBySlug } from '#lib/faq';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => groups.map((g) => ({ slug: g.slug }));

export const load: PageLoad = ({ params }) => {
	const group = groupBySlug(params.slug);
	if (!group) error(404, 'Halaman tidak ditemukan');
	const index = groups.indexOf(group);
	return {
		group,
		previous: groups[index - 1] ?? null,
		next: groups[index + 1] ?? null
	};
};
