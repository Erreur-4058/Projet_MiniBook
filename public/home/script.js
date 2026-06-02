const frames = [
    "../../asset/favicon/256_frame1.png",
    "../../asset/favicon/256_frame2.png",
    "../../asset/favicon/256_frame3.png",
    "../../asset/favicon/256_frame4.png",
    "../../asset/favicon/256_frame5.png",
    "../../asset/favicon/256_frame6.png"
];

let index = 0;

setInterval(() => {
    const favicon = document.getElementById("favicon");
    favicon.href = frames[index] + "?v=" + Date.now(); // évite le cache
    
    index = (index + 1) % frames.length;
}, 200);