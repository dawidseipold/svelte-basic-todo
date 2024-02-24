<script lang='ts'>
	type Filter = 'All' | 'Undone' | 'Done';

	let filter = $state('All') as Filter;
	const filterOptions = ['All', 'Undone', 'Done'];

	const randomId = function(length: number) {
  	return Number(Math.random().toString(36).substring(2, length + 2));
	};

  let todos = $state([
		{
			id: randomId(32),
			text: 'Learn Svelte',
			done: false
		},
		{
			id: randomId(32),
			text: 'Learn SvelteKit',
			done: false
		}
	]);

  function addTodo(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;

		const todoElement = event.target as HTMLInputElement;

		const id = randomId(32)
		const text = todoElement.value;
		const done = false;

		todos.push({ id, text, done });

    todoElement.value = '';
	}

	const changeFilter = (event: Event) => {
		const selectedFilter = (event.target as HTMLSelectElement).value as Filter;

		filter = selectedFilter;
	};

	const setFilteredTodos = () => {
		if (filter === 'All') return todos;
		if (filter === 'Undone') return todos.filter((todo) => !todo.done);
		if (filter === 'Done') return todos.filter((todo) => todo.done);

		return []
	};

	const filteredTodos = $derived(setFilteredTodos())

	const removeTodo = (event: Event) => {
		const todoElement = event.target as HTMLElement
		const todoId = todoElement.closest('.todo')?.getAttribute('data-id');

		if (todoId) {
			todos.splice(todos.findIndex((todo) => todo.id === Number(todoId)), 1);
		}
	};
</script>

<div class="wrapper">
	<h1 class="title">Simple Todo Application</h1>

	<select name="filter" id="filter" on:change={changeFilter}>
		{#each filterOptions as option}
			<option value={option}>{option}</option>
		{/each}
	</select>

	<input class="form-input" type="text" placeholder="Add todo" on:keydown={addTodo} />

	<div class="todos">
		{#if filteredTodos.length === 0}
			<p class="warning">No todos found</p>
		{:else}
			{#each filteredTodos as todo}
				<div class="todo" data-id={todo.id}>
					<input type="checkbox" bind:checked={todo.done} />
					<input type="text" value={todo.text} />

					<div class='delete-button' on:click={removeTodo}>X</div>
				</div>
			{/each}
		{/if}
	</div>
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