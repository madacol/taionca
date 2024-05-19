<script>
	import Chart from 'chart.js/auto';
	// import 'chartjs-adapter-luxon';

	export let chart_settings;
	
	function chart(canvas, chart_settings){
		new Chart(canvas, chart_settings);

		return {
			update(chart_settings) {
				new Chart(canvas, chart_settings);
			}
		}
	}
</script>

<canvas use:chart={chart_settings} id="acquisitions"></canvas>