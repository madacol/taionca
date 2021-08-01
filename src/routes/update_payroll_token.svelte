<script context="module">
	export async function preload() {
        await this.fetch('/api/public/pay_payroll');
    }
</script>
