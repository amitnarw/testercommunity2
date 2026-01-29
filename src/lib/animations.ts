export const expand = {
  initial: {
    top: 0,
  },
  enter: (i: number) => ({
    top: "100vh",
    transition: {
      duration: 0.6,
      delay: 0.05 * i,
      ease: [0.215, 0.61, 0.355, 1],
    },
    transitionEnd: { height: "0", top: "0" },
  }),
  exit: (i: number) => ({
    height: "100vh",
    transition: {
      duration: 0.6,
      delay: 0.05 * i,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

export const opacity = {
  initial: {
    opacity: 0.5,
  },
  enter: {
    opacity: 0,
  },
  exit: {
    opacity: 0.5,
  },
};

export const fade = {
  initial: {
    opacity: 0,
  },
  enter: (duration: number = 0.4) => ({
    opacity: 1,
    transition: {
      duration: duration,
      ease: "easeInOut",
    },
  }),
  exit: (duration: number = 0.4) => ({
    opacity: 0,
    transition: {
      duration: duration,
      ease: "easeInOut",
    },
  }),
};

export const slide = {
  initial: {
    x: "100%",
    opacity: 0,
  },
  enter: (duration: number = 0.4) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: duration,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: (duration: number = 0.4) => ({
    x: "-20%",
    opacity: 0,
    transition: {
      duration: duration,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const zoom = {
  initial: {
    scale: 0.95,
    opacity: 0,
  },
  enter: (duration: number = 0.4) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: duration,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: (duration: number = 0.4) => ({
    scale: 1.05,
    opacity: 0,
    transition: {
      duration: duration,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};
