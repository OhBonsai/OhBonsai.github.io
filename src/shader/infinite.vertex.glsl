#define PI 3.14159265358979
uniform float uTime;
uniform float uTravelLength;
uniform vec3 uAmp;
uniform vec3 uFreq;

attribute vec3 aOffset;
attribute vec3 aMetrics;
attribute vec3 aColor;

varying vec2 vUv;
varying float vScale;
varying vec3 vColor;

float nsin(float val){
    return sin(val) * 0.5+0.5;
}

vec3 getDistortion(float progress){
    float movementProgressFix = 0.02;
    return vec3(
    cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
    nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
    nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
    );
}


void main() {



    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;

    transformed.xy *= radius ;
    transformed.z *= myLength;

    // Add my length to make sure it loops after the lights hits the end
    transformed.z += myLength-mod( uTime *speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;

    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);



    vec4 mvPosition = modelViewMatrix * vec4(transformed,1.);
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    vColor = aColor;
}