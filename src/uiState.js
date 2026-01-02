export const UISTATE = {
    PAUSE: true,
    RESET: false,
    SPEED: 1,
    INFECTION_RATE: 50,
    VACCINATION_RATE: 30,
    FATALITY_RATE: 10,
    IMMUNOCOMPROMISED_RATE: 5,
    POPULATION_SIZE: 50,
    DAY: 0
};

export function initUIListeners() {
    const infection_slider = document.getElementById('infection-rate');

    // still dont know what onStart does
    const play_pause_button = document.getElementById('play-pause');
    play_pause_button.addEventListener('click', () => {
        UISTATE.PAUSE = !UISTATE.PAUSE;
        play_pause_button.textContent = UISTATE.PAUSE ? 'Play' : 'Pause';
        if (!UISTATE.PAUSE && onStart) //onstart?
        {
            // startGame;
        } 
    });

    // still dont know what onreset does
    const reset_button = document.getElementById('reset');
    reset_button.addEventListener('click', () => {
        UISTATE.PAUSE = true;
        UISTATE.DAY = 0;
        play_pause_button.textContent = 'Play';
        if (onReset) { // what is onreset?
            // reset game
        }
    })

    const speed_dropdown = document.getElementById('speed-dropdown');
    speed_dropdown.addEventListener('change', (e) => {
        UISTATE.SPEED = parseFloat(e.target.value);
    });
    
    // sliders
    infection_slider.addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('infection-rate-value').textContent = value + '%';
        UISTATE.INFECTION_RATE = parseInt(e.target.value);
    });

    const vaccination_slider = document.getElementById('vaccination-rate');
    vaccination_slider.addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('vaccination-rate-value').textContent = value + '%';
        UISTATE.VACCINATION_RATE = parseInt(e.target.value);
    });

    const fatality_slider = document.getElementById('fatality-rate');
    fatality_slider.addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('fatality-rate-value').textContent = value + '%';
        UISTATE.FATALITY_RATE = parseInt(e.target.value);
    });

    const immunocompromised_slider = document.getElementById('immunocompromised-rate');
    immunocompromised_slider.addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('immunocompromised-rate-value').textContent = value + '%';
        UISTATE.IMMUNOCOMPROMISED_RATE = parseInt(e.target.value);
    });

    const population_size_input = document.getElementById('population-size');
    population_size_input.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        // add isNaN after pressing pause/play
        e.target.value = value;
        UISTATE.POPULATION_SIZE = value;
    });

    // still need help button somewhere
}

export function updateStatsDisplay(counts) {
    const normal_counter = document.getElementById('normal-count');
    normal_counter.textContent = counts.normal;

    const immunocompromised_counter = document.getElementById('immunocompromised-count'); 
    immunocompromised_counter.textContent = counts.immunocompromised;

    const resistant_counter = document.getElementById('resistant-count');
    resistant_counter.textContent = counts.resistant;

    const exposed_counter = document.getElementById('exposed-count');
    exposed_counter.textContent = counts.exposed;

    const symptomatic_counter = document.getElementById('symptomatic-count');
    symptomatic_counter.textContent = counts.symptomatic;

    const dead_counter = document.getElementById('dead-count');
    dead_counter.textContent = counts.dead;
}

export function updateDayDisplay(day) {
    UISTATE.DAY = day;
    const turn_counter = document.getElementById('turn-count');
    turn_counter.textContent = day;
}