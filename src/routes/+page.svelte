<script lang='ts'>
	// Types
	type Todo = {
		id: string;
		text: string;
		done: boolean;
		createdAt: Date;
	};

	interface SortType {
		type: 'Date' | 'Name';
		order: 'Ascending' | 'Descending';
		displayedText: string
	};

	type Filter = 'All' | 'Undone' | 'Done';
	type Loading = 'loading';

	// Variables
	const filterOptions = ['All', 'Undone', 'Done'];
	let filter = $state(filterOptions[0]) as Filter;

	const sortingOption = [
		{ type: 'Date', order: 'Ascending', displayedText: 'Latest' },
		{ type: 'Date', order: 'Descending', displayedText: 'Oldest' },
		{ type: 'Name', order: 'Ascending', displayedText: 'A to Z' },
		{ type: 'Name', order: 'Descending', displayedText: 'Z to A' },
	];
	let sort = $state(sortingOption[0]) as SortType;

	let todos = $state<Todo[] | Loading>('loading');

	// Effects
	$effect(() => {
		const storedTodos = localStorage.getItem('todos');

		if (storedTodos) {
			todos = JSON.parse(storedTodos);
		} else {
			todos = [];
		}
	});

	$effect (() => {
		if (todos === 'loading') return;

		localStorage.setItem('todos', JSON.stringify(todos));
	});
	
	// Functions
  const addTodo = (event: KeyboardEvent) => {
		if (event.key !== 'Enter') return;

		const todoElement = event.target as HTMLInputElement;

		const id = window.crypto.randomUUID();
		const text = todoElement.value;
		const done = false;
		const createdAt = new Date();

		if (todos !== 'loading') {
			todos.push({ id, text, done, createdAt });
		}

    todoElement.value = '';
	}

	const removeTodo = (event: Event) => {
		const todoElement = event.target as HTMLElement
		const todoId = todoElement.closest('.todo')?.getAttribute('data-id');

		if (todoId && todos !== 'loading') {
			todos.splice(todos.findIndex((todo) => todo.id === todoId), 1);
		}
	};

	const changeFilter = (event: Event) => {
		const selectedFilter = (event.target as HTMLSelectElement).value as Filter;

		filter = selectedFilter;
	};

	const changeSort = (event: Event) => {
		const selectedSort = (event.target as HTMLSelectElement).value;

		sort = sortingOption.find((option) => option.displayedText === selectedSort) as SortType;
	};

	const setFilteredTodos = () => {
		if (todos === 'loading') return [];

		if (filter === 'All') return todos;
		if (filter === 'Undone') return todos.filter((todo) => !todo.done);
		if (filter === 'Done') return todos.filter((todo) => todo.done);

		return []
	};

	const setSortedTodos = () => {
		if (todos === 'loading') return [];

		return todos.sort((a, b) => {
			if (sort.type === 'Name') {
				if (sort.order === 'Ascending') return a.text.localeCompare(b.text);
				if (sort.order === 'Descending') return b.text.localeCompare(a.text);
			}

			if (sort.type === 'Date') {
				if (sort.order === 'Ascending') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				if (sort.order === 'Descending') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			}

			return 0;
		});
	};

	const setFinalTodos = () => {
		if (todos === 'loading') return [];

		return sortedTodos.filter((todo) => filteredTodos.includes(todo));
	};

	// Derived
	const filteredTodos = $derived(setFilteredTodos())
	const sortedTodos = $derived(setSortedTodos())

	const finalTodos = $derived(setFinalTodos());
</script>

<div class="wrapper">
	<h1 class="title">Simple Todo Application</h1>

	{#if todos === 'loading'}
		<p class="warning">Loading...</p>
	{:else}
		<div class="options-wrapper">
			<select name="sort" id="sort" on:change={changeSort}>
				{#each sortingOption as option}
					<option value={option.displayedText}>{option.displayedText}</option>
				{/each}
			</select>

			<select name="filter" id="filter" on:change={changeFilter}>
				{#each filterOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>

		<input class="form-input" type="text" placeholder="Add todo" on:keydown={addTodo} />

		<div class="todos">
			{#if finalTodos.length === 0}
				<p class="warning">No todos found</p>
			{:else}
				{#each finalTodos as todo}
					<div class="todo" data-id={todo.id}>
						<input type="checkbox" bind:checked={todo.done} />
						<input type="text" value={todo.text} />

						<div class='delete-button' on:click={removeTodo}>X</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		font-family: Arial, Helvetica, sans-serif;
	}

	:global(body) {
		background-color: #171719;
	}

	.wrapper {
		position: absolute;
		inset: 50%;
		translate: -50% -50%;
		width: max-content;
		height: max-content;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.options-wrapper {
		display: flex;
		width: 100%;
		justify-content: end;
		align-items: center;
		gap: 1rem;
	}

	.title {
		font-size: 4rem;
		color: white;
	}

	.todos {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-block-start: 1rem;
		width: 100%;
	}

	.todo {
		position: relative;
		width: 100%;
		padding: 1rem;
		background-color: #232229;
		border-radius: 1rem;
		display: flex;
		align-self: center;
	}

	.warning {
		color: #e10041;
		align-self: center;
		font-size: 1.5rem;
	}

	.delete-button {
		position: absolute;
		top: 50%;
		right: -2rem;
		transform: translate(0, -50%);
		font-size: 1.5rem;
		color: #e10041;
		cursor: pointer;
	
	}

	select {
		background: #232229;
		padding: 1rem;
		margin: 0;
		border-radius: 1rem;
		color: white;
		align-self: flex-end;
		border: none;

		&:focus {
			outline: none;
		}
	}

	input[type='text'] {
		width: 100%;
		background-color: transparent;
		border: none;
		font-size: 1.25rem;
		color: white;
		margin-right: 2rem;

		&:focus {
			outline: none;
		}

		&.form-input {
			background: #232229;
			padding: 1rem;
			margin: 0;
			border-radius: 1rem;
		}
	}

	input[type='checkbox'] {
		position: absolute;
		top: 50%;
		right: 1rem;
		translate: 0 -60%;
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.5rem;
		border: 2px solid #4a4a4a; /* border color */
		background-color: #2b2b2b; /* checkbox background color */
		cursor: pointer;

		&:checked {
			background-color: #4a4a4a; /* checked background color */
		}

		&:focus {
			outline: none;
			box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); /* focus outline */
		}
	}
</style>