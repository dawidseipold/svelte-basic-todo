<script lang='ts'>
  let todos = $state([
		{
			text: 'Learn Svelte',
			done: false
		},
		{
			text: 'Learn SvelteKit',
			done: false
		}
	]);

  function addTodo(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;

		const todoElement = event.target as HTMLInputElement;
		const text = todoElement.value;
		const done = false;

		todos.push({ text, done });

    todoElement.value = '';
	}
</script>

<div class="wrapper">
	<h1 class="title">Simple Todo Application</h1>

	<input class="form-input" type="text" placeholder="Add todo" on:keydown={addTodo} />

	<div class="todos">
		{#each todos as todo}
			<div class="todo">
				<input type="text" bind:value={todo.text} />
				<input type="checkbox" bind:checked={todo.done} />
			</div>
		{/each}
	</div>
</div>

<style>
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