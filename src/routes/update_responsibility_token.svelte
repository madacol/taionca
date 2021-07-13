<script context="module">
	export async function preload() {
        let pending_responsibilitys = [];
        let current_date = new Date();
        ({pending_responsibilitys} = await (await this.fetch('/api/public/last_pending_responsibilitys')).json());

        await Promise.all(pending_responsibilitys.map(async (responsibility) => {
			let deadline = new Date(responsibility.deadline);

            if ( deadline <= current_date ){

				await (await this.fetch("/api/public/update_responsibility",{
                    method: 'POST',
                    body: JSON.stringify({
                        responsibility
                    }),
                    headers: {'Content-Type': 'application/json'}
                })).json()
            }
        }));
    }
</script>
