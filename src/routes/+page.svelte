<script lang='ts'>
	import '$styles/index.scss';
	import { filterOptions, sortingOptions } from "$constants";

	// Types
	import type { Todo, Sort, Filter } from "$types";
	import { addTodo, editTodoText, removeTodo, setProcessedTodos } from "$utils";

	// Variables
	let loading = $state(true) as boolean;
	let todos = $state([]) as Todo[];
	let filter = $state(filterOptions[0]) as Filter;
	let sort = $state() as Sort;
	let todoInput = $state('') as string;

	// Effects
	$effect(() => {
		const storedTodos = localStorage.getItem('todos');
		const storedSort = localStorage.getItem('sort');
		const storedFilter = localStorage.getItem('filter');

		if (storedTodos && storedSort && storedFilter) {
			todos = JSON.parse(storedTodos);
			sort = JSON.parse(storedSort);
			filter = storedFilter as Filter;

			loading = false;
		} else {
			todos = [] as Todo[];
			sort = sortingOptions[0] as Sort;
			filter = filterOptions[0] as Filter;

			loading = false;
		}
	});

	$effect (() => {
		if (loading) return;

		localStorage.setItem('todos', JSON.stringify(todos));
		localStorage.setItem('sort', JSON.stringify(sort));
		localStorage.setItem('filter', filter);
	});
	
	// Functions
	const changeFilter = (event: Event) => {
		const selectedFilter = (event.target as HTMLSelectElement).value as Filter;

		filter = selectedFilter;
	};

	const changeSort = (event: Event) => {
		const selectedSort = (event.target as HTMLSelectElement).value;

		sort = sortingOptions.find((option) => option.displayedText === selectedSort) as Sort;
	};

	const multiTaskRemove = (todos: Todo[], targetString: string, removeCondtion: Todo[]) => {
		if (todos.length === 0){ 
			return alert('No tasks to remove');
		}

		if (confirm(`Are you sure you want to remove all ${targetString}?`)) {
			const remainingTodos = todos.filter((todo) => !removeCondtion.includes(todo));
			todos.splice(0, todos.length, ...remainingTodos);
		}
	}

	// Derived
	const processedTodos = $derived(setProcessedTodos(todos, sort, filter));

	const remaining = $derived(() => {
		if (loading) return;

		return todos.filter((todo) => !todo.done).length;
	});
</script>

<div class="wrapper">
	<h1 class="title">Simple Todo Application</h1>

	{#if loading}
		<p class="warning">Loading...</p>
	{:else}

		<header class="header">
			<div class="options-wrapper">
				<select name="sort" id="sort" value={sort.displayedText} on:change={changeSort}>
					{#each sortingOptions as option}
						<option value={option.displayedText}>{option.displayedText}</option>
					{/each}
				</select>
				
				<select name="filter" id="filter" bind:value={filter} on:change={changeFilter}>
					{#each filterOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>

			<div class="options-wrapper">
				<button on:click={() => multiTaskRemove(todos, 'done tasks', todos.filter(todo => todo.done))}>Remove all done</button>

				<button on:click={() => multiTaskRemove(todos, 'tasks', todos.filter(todo => todo))}>Remove all</button>
			</div>
		</header>

		<form class='form' on:submit|preventDefault={() => {
			addTodo(todoInput, todos)
			todoInput = '';
			}}>
			<input type="text" placeholder="Add todo" bind:value={todoInput}  />
			<button type="submit">Add a task</button>
		</form>

		<div class="todos">
			<span class='remaining'>Remaining tasks: {remaining()}</span>

			{#if processedTodos && processedTodos.length > 0}
				{#each processedTodos as todo}
					<div class="todo" data-id={todo.id}>
						<form>
							<input type="text" value={todo.text} on:change|preventDefault={(e) => editTodoText(e, todos)} />
							<input type="checkbox" bind:checked={todo.done} />
						</form>

						<button class='delete-button' on:click={(e) => removeTodo(e, todos)}>X</button>
					</div>
				{/each}
				
			{:else}
				<p class="warning">No todos found</p>
			{/if}
		</div>
	{/if}
</div>