// 项目数据配置文件
// 用于管理项目展示页面的数据

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: 'web' | 'mobile' | 'desktop' | 'other';
	techStack: string[];
	status: 'completed' | 'in-progress' | 'planned';
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
}

export const projectsData: Project[] = [
	{
		id: 'wechat',
		title: '仿微信项目',
		description: '基于 SpringBoot + Netty 的仿微信即时通讯项目，侧重后端 IM 与 Netty 实战	',
		image: '',
		category: 'web',
		techStack: ['Vue', 'JavaScript', 'Java', 'Springboot'],
		status: 'completed',
		liveDemo: 'https://blog.example.com',
		sourceCode: 'https://github.com/example/mizuki',
		startDate: '2024-01-01',
		endDate: '2024-06-01',
		featured: true,
		tags: ['Blog', 'Theme', 'Open Source']
	},
	{
		id: 'EasyTest',
		title: 'EasyTest',
		description: '基于uni-app开发的刷题软件',
		image: '',
		category: 'web',
		techStack: ['Vue', 'JavaScript', 'Java'],
		status: 'completed',
		liveDemo: 'https://portfolio.example.com',
		sourceCode: 'https://github.com/example/portfolio',
		startDate: '2023-09-01',
		endDate: '2023-12-01',
		featured: true,
		tags: ['Portfolio', 'React', 'Animation']
	},
	{
		id: 'e-commerce-platform',
		title: 'E-commerce Platform',
		description: '全栈电商平台，包含用户管理、商品管理、订单处理等功能。',
		image: '',
		category: 'web',
		techStack: ['Java', 'Vue', 'PostgreSQL'],
		status: 'planned',
		startDate: '2024-07-01',
		tags: ['E-commerce', 'Full Stack', 'Payment Integration']
	}
];

// 获取项目统计信息
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(p => p.status === 'completed').length;
	const inProgress = projectsData.filter(p => p.status === 'in-progress').length;
	const planned = projectsData.filter(p => p.status === 'planned').length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned
		}
	};
};

// 按分类获取项目
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === 'all') {
		return projectsData;
	}
	return projectsData.filter(p => p.category === category);
};

// 获取特色项目
export const getFeaturedProjects = () => {
	return projectsData.filter(p => p.featured);
};

// 获取所有技术栈
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach(project => {
		project.techStack.forEach(tech => techSet.add(tech));
	});
	return Array.from(techSet).sort();
};