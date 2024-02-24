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

	let todoInput = $state<string>('');

	// Effects
	$effect(() => {
		const storedTodos = localStorage.getItem('todos');

		console.log(todoInput.trim())

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
  const addTodo = () => {
		if (todoInput === '') return alert('Please enter a valid todo')

		const id = window.crypto.randomUUID();
		const text = todoInput.trim();
		const done = false;
		const createdAt = new Date();

		if (todos !== 'loading') {
			todos.push({ id, text, done, createdAt });
		}

		todoInput = '';
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

	const remaining = $derived(() => {
		if (todos === 'loading') return;

		return todos.filter((todo) => !todo.done).length;
	});
</script>

<div class="wrapper">
	<h1 class="title">Simple Todo Application</h1>

	{#if todos === 'loading'}
		<p class="warning">Loading...</p>
	{:else}
		<header class="header">
			<span class='remaining'>Remaining tasks: {remaining()}</span>

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
		</header>

		<form class='form' on:submit|preventDefault={addTodo}>
			<input class="form-input" type="text" placeholder="Add todo" bind:value={todoInput} />
			<button class="form-button" type="submit">Add Todo</button>
		</form>

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
		margin: 0 auto;
		padding: 2rem;
		width: max-content;
		height: max-content;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.header {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
	}

	.remaining {
		display: flex;
		width: 100%;
		font-size: 1.25rem;
		color: white;
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

	.form {
		display: flex;
		width: 100%;
		gap: 1rem;

		&-input {
			width: 100%;
			background-color: transparent;
			border: none;
			font-size: 1.25rem;
			color: white;
			margin-right: 2rem;

			&:focus {
				outline: none;
			}
		}

		&-button {
			background-color: #e10041;
			color: white;
			padding: 1rem;
			border: none;
			border-radius: 1rem;
			cursor: pointer;
			font-size: 1.25rem;

			&:focus {
				outline: none;
			}
		}
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