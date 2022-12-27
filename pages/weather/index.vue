<template>
	<div class="vww__widget" :style="{ color: textColor }">
		<form @submit.prevent="search">
			<input v-model="location" type="text" placeholder="Enter location">
			<button type="submit">Search</button>
		</form>
		<select v-if="locations.length > 0" v-model="selectedLocation">
			<option v-for="location in locations" :key="location.id" :value="location">
				{{ location.name }}
			</option>
		</select>
		<slot name="header">
			<div class="vww__header" :style="{ borderColor: barColor }" v-if="!hideHeader">
				<span class="vww__title">
					<slot name="title">Clima</slot>
				</span>
			</div>
		</slot>

		<div class="vww__content">
			<div class="vww__loading" v-if="loading">
				<slot name="loading">
					<skycon condition="partly-cloudy-day" :color="textColor" :paused="disableAnimation" />
					<span class="vww__title">Cargando...</span>
				</slot>
			</div>

			<div class="vww__error" v-else-if="error || !weather || !currently || !daily">
				<slot name="error">
					<skycon condition="rain" :color="textColor" :paused="disableAnimation" />
					<span class="vww__title">{{ error || "Algo sali&oacute mal!" }}</span>
				</slot>
			</div>

			<template v-else>
				<div class="vww__currently">
					<div>
						<skycon :condition="currently.icon" size="80" :color="textColor" :paused="disableAnimation" />
						<div class="vww__temp">
							{{ Math.round(currently.temperature) }}&deg;
							<div v-if="isDownward">
								<svg viewBox="0 0 306 306" width="24" height="24">
									<polygon points="270.3,58.65 153,175.95 35.7,58.65 0,94.35 153,247.35 306,94.35"
										:style="{ fill: textColor }" />
								</svg>
							</div>
							<div v-else>
								<svg viewBox="0 0 306 306" width="24" height="24">
									<polygon points="35.7,247.35 153,130.05 270.3,247.35 306,211.65 153,58.65 0,211.65"
										:style="{ fill: textColor }" />
								</svg>
							</div>
						</div>
					</div>
					<div class="vww__title">{{ currently.summary }}</div>
					<div class="vww__wind">
						Viento: {{ Math.round(currently.windSpeed * 1.60934) }} Kph ({{ windBearing }})
					</div>
				</div>

				<div class="vww__daily">
					<div class="vww__day" :key="day.time" v-for="day in daily">
						<span>{{ day.weekName }}</span>
						<span>
							<skycon style="display: block" :condition="day.icon" size="26" :color="textColor"
								:paused="disableAnimation" />
						</span>
						<div class="vww__day-bar">
							<div :style="{ height: `${day.top}%` }">
								<span>{{ Math.round(day.temperatureMax) }}&deg;</span>
							</div>
							<div :style="{
	borderRadius: '10px',
	background: barColor,
	height: `${day.height}%`,
}">
								&nbsp;
							</div>
							<div :style="{ height: `${day.bottom}%` }">
								<span>{{ Math.round(day.temperatureMin) }}&deg;</span>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>
  
<script src="./script.js"></script>
  
<style src="./styles.scss" lang="scss">

</style>
  