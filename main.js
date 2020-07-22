const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// Set ENV
process.env.NODE_ENV = 'production';

// Listen for app to be ready
app.on('ready', () => {
	// Create new window
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
		},
	});
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
		webPreferences: {
			nodeIntegration: true,
		},
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

// Catch item add
ipcMain.on('item:add', (err, item) => {
	mainWindow.webContents.send('item:add', item);
	addWindow.close();
	addWindow = null;
});

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
				click() {
					mainWindow.webContents.send('item:clear');
				},
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
