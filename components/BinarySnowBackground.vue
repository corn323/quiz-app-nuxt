<template>
    <div class="binary-snow-container">
        <div class="binary-snow" v-for="n in 100" :key="n" :style="randomPosition()">
            {{ Math.round(Math.random()) }}
        </div>
    </div>
</template>

<script setup lang="ts">
function randomPosition(): Record<string, string> {
    const colors = [
        'rgba(103, 201, 247, 0.3)',
        'rgba(255, 255, 255, 0.3)',
        'rgba(200, 200, 200, 0.3)'
    ];

    return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 10 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
        color: colors[Math.floor(Math.random() * colors.length)]
    };
}
</script>

<style scoped>
.binary-snow-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
}

.binary-snow {
    top: -20vh;
    position: absolute;
    font-size: 16px;
    user-select: none;
    animation: snowfall linear infinite;
}

@keyframes snowfall {
    0% {
        transform: translateY(-20px);
        opacity: 0.1;
    }

    100% {
        transform: translateY(100vh);
        opacity: 1;
    }
}

@media (max-width: 600px) {
    .binary-snow {
        font-size: 12px;
    }
}
</style>