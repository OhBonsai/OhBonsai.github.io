uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;
varying float vProgress;



// A simple way to create color variation in a cheap way (yes, trigonometrics ARE cheap
// in the GPU, don't try to be smart and use a triangle wave instead).

// See https://iquilezles.org/articles/palettes for more information
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec3 c1 = vec3(0., 0., 0.);
    vec3 c2 = vec3(1., 1., 0.);


    gl_FragColor = vec4(vUv.x, 0., 0.,  1.0);
}
