uniform float uCamX;
uniform float uCamZ;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform float uEra;   // 0 meadow · 1 snow steppe · 2 desert sand · 3 paving of 2240 · 4 dark asphalt of today
varying vec3 vWP;
/* The past: an endless green meadow with dirt patches, clover, little flowers and wind waves in the grass. */
void main(){
    vec2 w = vWP.xz + vec2(uCamX, uCamZ);
    float d = length(vWP - uEye);
    float big = fbm(w * 0.012), mid = vnoise(w * 0.15), fine = vnoise(w * 2.3);
    vec3 grass = mix(vec3(0.16, 0.34, 0.07), vec3(0.32, 0.50, 0.12), big);
    grass = mix(grass, vec3(0.42, 0.52, 0.16), smoothstep(0.55, 0.8, mid) * 0.5);
    grass *= 0.85 + 0.3 * fine * (1.0 - smoothstep(20.0, 120.0, d));
    // wind waves rolling over the grass
    grass *= 0.92 + 0.1 * sin(w.x * 0.08 + w.y * 0.05 - uTime * 1.6) * smoothstep(0.3, 0.7, big);
    // dirt patches and a worn trail
    float dirt = smoothstep(0.62, 0.72, fbm(w * 0.03 + 7.0));
    vec3 col = mix(grass, vec3(0.36, 0.28, 0.17) * (0.8 + 0.4 * fine), dirt * 0.8);
    // flowers (only near the camera)
    vec2 fc = floor(w * 1.7);
    float fl = step(0.985, h21(fc)) * (1.0 - smoothstep(0.08, 0.2, length(fract(w * 1.7) - 0.5))) * (1.0 - smoothstep(15.0, 45.0, d));
    vec3 fcol = mix(vec3(1.0, 0.95, 0.3), vec3(0.95, 0.5, 0.85), step(0.5, h21(fc + 3.1)));
    col = mix(col, fcol, fl * (1.0 - dirt));
    if (uEra > 0.5 && uEra < 1.5) {          // snow: blue-white drifts, sparkles near the camera, wind-blown streaks
        col = mix(vec3(0.80, 0.84, 0.92), vec3(0.97, 0.98, 1.0), big) * (0.92 + 0.1 * mid);
        col *= 0.95 + 0.05 * sin(w.x * 0.4 + w.y * 0.9 + fine * 3.0);
        col += vec3(0.6) * step(0.995, h21(floor(w * 9.0))) * (1.0 - smoothstep(4.0, 18.0, d));
    } else if (uEra > 1.5 && uEra < 2.5) {   // sand: dunes and wind ripples
        col = mix(vec3(0.80, 0.64, 0.40), vec3(0.93, 0.80, 0.55), big);
        col *= 0.9 + 0.12 * sin(w.x * 1.6 + w.y * 0.7 + mid * 4.0) * (1.0 - smoothstep(10.0, 60.0, d));
        col = mix(col, vec3(0.7, 0.55, 0.34), smoothstep(0.6, 0.75, mid) * 0.35);
    } else if (uEra > 2.5 && uEra < 3.5) {   // 2240: pale stone tiles with thin light lines
        vec2 tl = fract(w / 3.0); float edge = 1.0 - smoothstep(0.0, 0.03, min(min(tl.x, 1.0 - tl.x), min(tl.y, 1.0 - tl.y)));
        col = mix(vec3(0.82, 0.85, 0.88), vec3(0.9, 0.92, 0.94), h21(floor(w / 3.0))) * (0.96 + 0.04 * fine);
        col = mix(col, vec3(0.55, 0.62, 0.7), edge * 0.6);
        float lane = 1.0 - smoothstep(0.0, 0.08, abs(fract(w.x / 24.0) - 0.5) * 24.0 - 0.0);
        col += vec3(0.1, 0.55, 0.9) * lane * (0.6 + 0.4 * sin(uTime * 2.0 + w.y * 0.1));
    } else if (uEra > 3.5) {                 // today, blackout: asphalt, a road along x with dashed lines, sidewalks
        col = vec3(0.10, 0.10, 0.11) * (0.8 + 0.4 * fine) * (0.9 + 0.2 * big);
        float rz = abs(w.y - 27.0); col = mix(col, vec3(0.2, 0.2, 0.21) * (0.85 + 0.3 * fine), step(9.0, rz));
        col += vec3(0.5, 0.48, 0.4) * (1.0 - smoothstep(0.1, 0.18, rz)) * step(0.5, fract(w.x / 6.0));
        col += vec3(0.4) * (1.0 - smoothstep(0.08, 0.14, abs(rz - 8.6)));
    }
    col *= 0.55 + 0.6 * max(normalize(uSunDir).y, 0.0) * uSunCol;
    col += headLight(vWP) * col * 2.2;
    col = applyFog(col, d, 0.0);
    gl_FragColor = vec4(col, 1.0);
}
