const token = process.env.TOKEN;
const username = "Atanda1";

let profileDetails = "";
let repoList = "";


let profile = [];
let repos = [];

axios.defaults.headers.common["Authorization"] = "bearer " + token;

axios
  .post("https://api.github.com/graphql", {
    query: `
	 	query {			
			repositoryOwner(login: "Atanda1") {
				repositories(last: 20, orderBy: {field: PUSHED_AT, direction: ASC}) {
					edges {
						node {
							id
							name
							nameWithOwner
							languages(first: 1) {
							edges {
								node {
								name
								color
								id
								}
							}
							}
							stargazerCount
							description
							updatedAt
							forkCount
						}
					}
				}
			}						
		} 
	`,
  })
  .then((res) => {
    repos = res.data;
    repos.data.repositoryOwner.repositories.edges
      .slice()
      .reverse()
      .forEach(function (item) {
        
        let description = item.node.description != null ? item.node.description : "";
		const time = new Date(item.node.updatedAt).toDateString().slice(0, 11).slice(3, 11);
		repoList += 
		`
			<li class="gh-main__repos__repo">
			<div class="gh-main__repos__repo__top">
			<div class="gh-main__repos__repo__details">
				<h2 class="title">
				<a href="https://github.com/${item.node.nameWithOwner}">
					${item.node.name}
				</a>
				</h2>
				<p class="desc">${description}</p>
			</div>
			<a href="" class="gh-btn gh-btn--light gh-btn--sm"
				><i
				data-v-07452373=""
				data-name="star"
				data-tags="bookmark,favorite,like"
				data-type="star"
				class="icon feather feather--star"
				><svg
					data-v-07452373=""
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-star feather__content"
				>
					<polygon
					points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
					></polygon></svg
				></i>
				Star</a
			>
			</div>
			<div class="gh-main__repos__repo__details__extra">
			<figure style="background-color: ${item.node.languages.edges[0].node.color};" class="br1"></figure>
		  	<span class="detail">${item.node.languages.edges[0].node.name}</span
			<span class="detail"
				><i
				data-v-07452373=""
				data-name="star"
				data-tags="bookmark,favorite,like"
				data-type="star"
				class="feather feather--star"
				><svg
					data-v-07452373=""
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-star feather__content"
				>
					<polygon
					points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
					></polygon></svg
				></i>
				${item.node.stargazerCount}</span
			><span class="detail"
				><i
				data-v-07452373=""
				data-name="git-branch"
				data-tags="code,version control"
				data-type="git-branch"
				class="feather feather--git-branch"
				><svg
					data-v-07452373=""
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-git-branch feather__content"
				>
					<line x1="6" y1="3" x2="6" y2="15"></line>
					<circle cx="18" cy="6" r="3"></circle>
					<circle cx="6" cy="18" r="3"></circle>
					<path d="M18 9a9 9 0 0 1-9 9"></path></svg
				></i>
				${item.node.forkCount}</span
			><span class="detail">Updated on ${time}</span>
			</div>
		    </li>
		`;

        document.getElementById("repos__list").innerHTML = repoList;
      });
  })
  .catch((err) => {console.log(err);});

axios
  .post("https://api.github.com/graphql", {
    query: `
		query {
			user(login: "Atanda1") {
			avatarUrl
			bio
			name
			login
			}
		}	  
	`,
  })
  .then((res) => {
    profile = res.data;
    document.getElementById("gh__header__user__imgId").src = profile.data.user.avatarUrl;
    
    profileDetails += `
		<div class="gh-main__profile__user">
		<figure class="gh-main__profile__user__img">
		<img
			src="${profile.data.user.avatarUrl}"
			alt="profile picture"
		/>
		</figure>
		<div class="gh-main__profile__user__name">
			<h1>${profile.data.user.name}</h1>
			<span class="username">${profile.data.user.login}</span>
		</div>
		</div>
		<div class="gh-main__profile__about">
		${profile.data.user.bio}
		</div>
		`;
    document.getElementById("gh-main__profile__data").innerHTML = profileDetails;
  })
  .catch((err) => console.log(err));
