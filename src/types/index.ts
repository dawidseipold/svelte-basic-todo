export type Todo = {
	id: string;
	text: string;
	done: boolean;
	createdAt: Date;
};

export interface Sort {
	type: 'Date' | 'Name';
	order: 'Ascending' | 'Descending';
	displayedText: string;
}

export type Filter = 'All' | 'Undone' | 'Done';
