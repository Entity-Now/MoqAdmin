export const inViewAnimate = {
	Start: {
		opacity: 0.1,
		x: 10,
	},
	End: {
		opacity: 1,
		x: 0,
	},
	transition: {
		type: "spring",
		stiffness: 260,
		damping: 20,
	},
	inViewOption: {
		margin: 100,
	},
};


export const GradientOpacity = {
	variants: {
		Start: {
			opacity: 0.1,
			scale: 0.8,
		},
		End: {
			opacity: 1,
			scale: 1,
		},
	},
	transition: {
		type: "spring",
		stiffness: 260,
		damping: 20,
	},
	initial: "Start",
	inView: "End",
	inViewOptions: {
		once: true,
	},
};

export const fromBottomToUp = {
	variants: {
		Start: {
			y: 10,
			opacity: 0,
		},
		End: {
			y: 0,
			opacity: 1,
		},
	},
	transition: {
		type: "spring",
		stiffness: 260,
		damping: 20,
	},
	initial: "Start",
	inView: "End",
    inViewOptions: {
        once: true
    }
};

export const listFromBottomToUp = {
	variants: {
		Start: {
			y: 20,
			opacity: 0,
		},
		End: (custom: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: custom * 0.1,
				ease: "easeInOut",
				duration: 0.4,
			},
		}),
	},
	initial: "Start",
	inView: "End",
	inViewOptions: {
		once: true,
	},
};