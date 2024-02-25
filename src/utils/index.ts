import type { Filter, Sort, Todo } from '$types';

export const addTodo = (todoInput: string, todos: Todo[]) => {
	if (todoInput === '' || todoInput.trim() === '') return alert('Please enter a valid todo');

	const id = window.crypto.randomUUID();
	const text = todoInput.trim();
	const done = false;
	const createdAt = new Date();

	todos.push({ id, text, done, createdAt });
};

export const removeTodo = (event: Event, todos: Todo[]) => {
	const todoElement = event.target as HTMLElement;
	const todoId = todoElement.closest('.todo')?.getAttribute('data-id');

	if (todoId) {
		todos.splice(
			todos.findIndex((todo) => todo.id === todoId),
			1
		);
	}
};

export const editTodoText = (event: Event, todos: Todo[]) => {
	const todoText = (event.target as HTMLInputElement).value.trim();

	if (todoText === '') return alert('Please enter a valid todo');

	todos.map((todo) => {
		if (todo.id === (event.target as HTMLElement).closest('.todo')?.getAttribute('data-id')) {
			todo.text = todoText;
		}
	});
};

const filterTodos = (todos: Todo[], filter: Filter) => {
	const filterByDoneStatus = (todos: Todo[], done: boolean) => {
		return todos.filter((todo) => todo.done === done);
	};

	if (filter === 'All') return todos;
	if (filter === 'Undone') return filterByDoneStatus(todos, false);
	if (filter === 'Done') return filterByDoneStatus(todos, true);
};

const sortTodos = (todos: Todo[], sort: Sort) => {
	return todos.sort((a, b) => {
		if (sort.type === 'Name') {
			if (sort.order === 'Ascending') return a.text.localeCompare(b.text);
			if (sort.order === 'Descending') return b.text.localeCompare(a.text);
		}

		if (sort.type === 'Date') {
			if (sort.order === 'Ascending')
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			if (sort.order === 'Descending')
				return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}

		return 0;
	});
};

export const setProcessedTodos = (todos: Todo[], sort: Sort, filter: Filter) => {
	if (!todos) return;

	let processedTodos = todos;

	if (filter) {
		processedTodos = filterTodos(processedTodos, filter) || processedTodos;
	}

	if (sort) {
		processedTodos = sortTodos(processedTodos, sort);
	}

	return processedTodos as Todo[];
};
