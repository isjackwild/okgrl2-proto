import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);
const mobile = md.mobile() ? true : false;

export const SKYBOX_RADIUS = 60;
export const SKYBOX_SEGS = 30;

export const CAMERA_FOV = 75;
export const CAMERA_ORBIT_OFFSET = 0.1;
export const CAMERA_MOVE_STEP = 0.00066;

export const TARGET_RADIUS = mobile ? 4.5 : 3;
export const TARGET_FOCUS_SCALE = mobile ? 1.4 : 1.33;
export const TARGET_HITAREA_RADIUS = TARGET_RADIUS * TARGET_FOCUS_SCALE;
export const TARGET_MAX_WANDER = mobile ? 7 : 4; // how far the shop target can move from it's rest
export const TARGET_DISTANCE = (SKYBOX_RADIUS - TARGET_RADIUS);

export const SCALE_DAMPING = 0.9;
export const SCALE_SPRING = 0.03;

export const SPHEREMAP_SRC = 'assets/maps/Nicopanda_360_V03-low.jpg';
export const BUBBLE_SRC = 'assets/maps/bubbles/BUBBLE-all.png';
export const ICON_LINK_SRC = 'assets/maps/bubbles/Icon-LINK.png';
export const ICON_PLUS_SRC = 'assets/maps/bubbles/Icon-PLUS.png';
export const VIDEO_SRC_SD = 'https://player.vimeo.com/external/133547147.hd.mp4?s=d3e74a3b47091a3002de13d49b32b91a&profile_id=119';
export const VIDEO_SRC_HD = 'assets/maps/nicopanda-low.mp4';
export const GEOM_SRC = 'assets/geom/Nicopanda-objects3.dae';

export const VIDEO_TRANSITION_DURATION = 0.55;
export const SKYBOX_DIM_OPACITY = 0.3;
// TODO — VIDEO drops down with a little bounce and rotation :):):):)