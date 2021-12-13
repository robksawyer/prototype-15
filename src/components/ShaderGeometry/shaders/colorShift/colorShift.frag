varying vec2 vUv;

uniform float time;
uniform vec3 color;

void main() {
    gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
}