<script>
	import Chart from 'chart.js/auto';
	// import 'chartjs-adapter-luxon';
	// import 'chartjs-adapter-date-fns';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

	$:if (typeof window !== "undefined")
		import("chartjs-plugin-zoom").then((plugin) => {
			Chart.register(plugin.default);
		});

	export let chart_settings;
	export let reset_zoom;
	let my_chart;

	$:if(reset_zoom){
		reseting_zoom()
	}
	
	function reseting_zoom(){
		my_chart.resetZoom()
		reset_zoom = false;
	}
	function chart(canvas, chart_settings){
		my_chart = new Chart(canvas, chart_settings);
		return {
			update(chart_settings) {
				my_chart.data = chart_settings.data;
				my_chart.update();
				// my_chart = new Chart(canvas, chart_settings);
			}
		}
	}
</script>

{#if chart_settings}
	<canvas use:chart={chart_settings} id="acquisitions" {reset_zoom}></canvas>
{/if}