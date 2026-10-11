# Jze — Static Website

This is the plain HTML, CSS, and JavaScript version of the Jze portfolio website. The site itself has no framework, package manager, or build step.

## Preview on your computer

Open `index.html` in a web browser.

## Publish with GitHub Pages

1. Extract this folder and upload its contents to the top level of your GitHub repository. `index.html` should be in the repository root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your main branch and the `/(root)` folder, then save.

All local image, font, stylesheet, and script paths are relative, so the site also works when GitHub Pages serves it from a repository subfolder.

## Contact form

The form sends its submission to the site's `/api/contact` endpoint. The API sends it to `hundredrackies@gmail.com` through the connected Gmail account; the Gmail connection stays on the server and is not included in these static files.

GitHub Pages only hosts static files, so it cannot send email by itself. To use the form on GitHub Pages:

1. Publish the API server with the Replit app so `/api/contact` is available.
2. Set `apiBaseUrl` in `config.js` to the published Replit app's origin (for example, `https://your-app.replit.app`).
3. Upload the contents of this folder to GitHub Pages.

When previewed in the Replit app, leave `apiBaseUrl` empty. Opening `index.html` directly from your computer still previews the design, but the email form needs the API server running.
