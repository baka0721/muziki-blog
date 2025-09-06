// 时间线数据配置文件
// 用于管理时间线页面的数据

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string; // 如果为空表示至今
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: {
		name: string;
		url: string;
		type: "website" | "certificate" | "project" | "other";
	}[];
	icon?: string; // Iconify icon name
	color?: string;
	featured?: boolean;
}

export const timelineData: TimelineItem[] = [
	{
		id: "current-study",
		title: "物联网工程专业在读",
		description:
			"目前正在学习物联网工程专业，专注于Web开发和软件工程方向。",
		type: "education",
		startDate: "2023-09-01",
		location: "湛江",
		organization: "广东海洋大学",
		achievements: [
			"完成了数据结构与算法课程设计",
			"参与了多个课程项目开发",
		],
		icon: "material-symbols:school",
		color: "#059669",
		featured: true,
	},
	{
		id: "wechat",
		title: "仿微信项目",
		description: "基于 SpringBoot + Netty 的仿微信即时通讯项目，侧重后端 IM 与 Netty 实战 。",
		type: "project",
		startDate: "2025-06-01",
		endDate: "2025-3-15",
		skills: ["Java", "MySQL"],
		achievements: [
			"获得了课程设计优秀成绩",
			"实现了完整的CRUD功能",
			"学会了数据库设计和优化",
		],
		icon: "material-symbols:database",
		color: "#EA580C",
	},
	{
		id: "easytest",
		title: "EasyTest刷题软件",
		description: "基于 SpringBoot + uni-app 的刷题项目。",
		type: "project",
		startDate: "2024-09-01",
		endDate: "2024-11-01",
		skills: ["Java", "MySQL","uni-app","Vue"],
		achievements: [
			"获得了课程设计优秀成绩",
			"实现了完整的CRUD功能",
			"学会了数据库设计和优化",
		],
		icon: "material-symbols:database",
		color: "#EA580C",
	},
	{
		id: "student-management-system",
		title: "学生管理系统课程设计",
		description: "数据库课程的期末项目，开发了一个完整的学生信息管理系统。",
		type: "project",
		startDate: "2023-12-01",
		endDate: "2023-12-07",
		skills: ["Java", "MySQL"],
		achievements: [
			"获得了课程设计优秀成绩",
			"实现了完整的CRUD功能",
			"学会了数据库设计和优化",
		],
		icon: "material-symbols:database",
		color: "#EA580C",
	},
	{
		id: "high-school-graduation",
		title: "高中毕业",
		description: "以优异成绩从高中毕业，考入广东海洋大学物联网工程专业。",
		type: "education",
		startDate: "2020-09-01",
		endDate: "2023-06-30",
		location: "广东广州",
		organization: "广东外语外贸大学实验中学",
		achievements: [
			"高考成绩548分"
		],
		icon: "material-symbols:school",
		color: "#2563EB",
	},
	{
		id: "first-programming-experience",
		title: "初次接触编程",
		description: "在大学专业课上第一次接触编程，开始学习Java基础语法。",
		type: "education",
		startDate: "2023-10-01",
		skills: ["Java", "基础编程概念"],
		achievements: [
			'完成了第一个"Hello World"程序',
			"学会了基本的循环和条件语句",
			"培养了对编程的兴趣",
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
	},
	{
		id: "english-certificate",
		title: "英语四六级证书",
		description: "通过了大学英语四六级考试，具备了基本的英语读写能力。",
		type: "achievement",
		startDate: "2024-06-15",
		organization: "全国大学英语四、六级考试委员会",
		achievements: [
			"四级成绩：550分",
			"六级成绩：552分",
			"提升了英语技术文档阅读能力",
			"为后续学习国外技术资料打下基础",
		],
		links: [
			{
				name: "CET-4 Certificate",
				url: "https://cet.neea.edu.cn/",
				type: "certificate",
			},
		],
		icon: "material-symbols:translate",
		color: "#059669",
	},
];

// 获取时间线统计信息
export const getTimelineStats = () => {
	const total = timelineData.length;
	const byType = {
		education: timelineData.filter((item) => item.type === "education").length,
		work: timelineData.filter((item) => item.type === "work").length,
		project: timelineData.filter((item) => item.type === "project").length,
		achievement: timelineData.filter((item) => item.type === "achievement")
			.length,
	};

	return { total, byType };
};

// 按类型获取时间线项目
export const getTimelineByType = (type?: string) => {
	if (!type || type === "all") {
		return timelineData.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
	}
	return timelineData
		.filter((item) => item.type === type)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
};

// 获取特色时间线项目
export const getFeaturedTimeline = () => {
	return timelineData
		.filter((item) => item.featured)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
};

// 获取当前进行中的项目
export const getCurrentItems = () => {
	return timelineData.filter((item) => !item.endDate);
};

// 计算总工作经验
export const getTotalWorkExperience = () => {
	const workItems = timelineData.filter((item) => item.type === "work");
	let totalMonths = 0;

	workItems.forEach((item) => {
		const startDate = new Date(item.startDate);
		const endDate = item.endDate ? new Date(item.endDate) : new Date();
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
		totalMonths += diffMonths;
	});

	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
