# UI for AI4Code Tools

## Running 

Run the following command.

```bash
docker-compose up
docker compose up # For newer Docker version
```

Go to `localhost:1313` to see the website.

## Adding new pages

Either go to Docker Desktop, view the running container, go to terminal or run this command

```bash
docker exec -it hugo sh
```

Then run this command to add a new page

```bash
hugo new <path to page>/index.en.md
```

For example, if you want to create a new page in the `tools` folder called `random_tools`, run

```bash
hugo new tools/random_tools/index.md
```

This website is built using Hugo and use Bootstrap for styling. For more information look at [Hugo](https://gohugo.io/documentation/) and [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/) docs.


