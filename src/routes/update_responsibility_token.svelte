<script context="module">
	export async function preload() {
        let pending_responsibilitys = [];
        let current_date = new Date();
        ({pending_responsibilitys} = await (await this.fetch('/api/public/last_pending_responsibilitys')).json());

        await Promise.all(pending_responsibilitys.map(async (responsibility) => {
			let deadline = new Date(responsibility.deadline);

            if ( deadline <= current_date ){

                console.log("Entró");
				await (await this.fetch("/api/public/update_responsibility",{
                    method: 'POST',
                    body: JSON.stringify({
                        responsibility
                    }),
                    headers: {'Content-Type': 'application/json'}
                })).json()
            }else {
				console.log("No hay responsabilidades por actualizar");
			}
        }));
    }
</script>
