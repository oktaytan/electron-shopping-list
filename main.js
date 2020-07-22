const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', () => {
	// Create new window
	mainWindow = new BrowserWindow({});
	// Load html into window
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'mainWindow.html'),
			protocol: 'file',
			slashes: true,
		})
	);

	// Quit app when closed
	mainWindow.on('closed', () => app.quit());

	// Build menu form template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert menu
	Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow() {
	// Create new window
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Shopping List Item',
	});
	// Load html into window
	addWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'addWindow.html'),
			protocol: 'file',
			slashes: true,
		})
	);
	// Garbage Collection Handle
	addWindow.on('closed', () => (addWindow = null));
}

// Create menu template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Add Item',
				click() {
					createAddWindow();
				},
			},
			{
				label: 'Clear Items',
			},
			{
				label: 'Quit',
				accelarator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() {
					app.quit();
				},
			},
		],
	},
];

// If Mac, add app name to menu
if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({
		label: app.getName(),
		role: 'ShoppingList',
	});
}

// Add developer tools if not in production
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Dev Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelarator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				},
			},
			{
				role: 'reload',
			},
		],
	});
}
