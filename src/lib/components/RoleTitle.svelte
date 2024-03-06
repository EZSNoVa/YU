<script lang="ts">
	import { Role } from "$types";

    export let role: Role;
</script>

<h1 
    class="text-4xl font-bold text-center
    {role === Role.JUDGE ? 'text-red-400' : 'text-blue-400'}
    "
>
    {role}
</h1>