export const fragmentShaderSourceCode = `
precision mediump float;

varying vec2 v_texcoord;
         
uniform sampler2D u_texture;

uniform vec4 u_color;

void main() {
    vec4 col = texture2D(u_texture, v_texcoord);
    col *= u_color;
    gl_FragColor = col;
    if(gl_FragColor.a < 0.5) discard;
}
`
