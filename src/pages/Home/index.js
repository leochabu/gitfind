import { useState } from "react";
import { Header } from "../../components/Header";
import './styles.css';
import ItemList from "../../components/ItemList";
import background from "../../assets/images/background.png"
//require('dotenv').config()


function App() {
  console.log(process.env.REACT_APP_API_KEY)
  const headers = { 'Authorization': 'Bearer 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' };
  const [user, setUser] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [repos, setRepos] = useState(null)
  const [lastSearches, setLastSearches] = useState([]);

  const handleGetData = async() =>{
    const userData = await fetch(`https://api.github.com/users/${user}`, { headers })
    const newUser = await userData.json();
  
    const reposData = await fetch(`https://api.github.com/users/${user}/repos`, { headers })
    const newRepos = await reposData.json();

    if(newUser.login){
      const {avatar_url, name, bio, login} = newUser;
      setCurrentUser({avatar_url, name, bio, login});
    }

    if(newRepos.length){
      setRepos(newRepos);
    } 

    handleLastSearches();
  }

  const handleLastSearches = () =>{
    const lastSearches = localStorage.getItem('lastSearches');
    
    if(!lastSearches){
      localStorage.setItem('lastSearches', user)
      setLastSearches(localStorage.getItem('lastSearches'));
      return;
    }

    if(lastSearches && lastSearches.indexOf(user) ===-1){
      let lastSearchedUsers = [];
      lastSearchedUsers.push(lastSearches);
      lastSearchedUsers.push(user);
      localStorage.setItem('lastSearches',lastSearchedUsers);
      const lastSearchesArray = lastSearches;
      setLastSearches(lastSearchesArray);
    }
  }

  function stringToArray (){
    const stringToArray = localStorage.getItem('lastSearches').split(',');
    return stringToArray;
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        <img src={background} alt="git" className="background" />
        
        <div className="search-bar">
            <input name="username" placeholder="@username" value={user}  onChange={event => setUser(event.target.value)}/>
            <button onClick={handleGetData}>Buscar</button>
        </div>

        <div className="content">
            <div className="column last-searches">
                <p>
                  {lastSearches?.length ? 'Last searches: '+ stringToArray() : ''}
                </p>
            </div>
            <div className="column">          
              {currentUser?.login ? (
              <>
                <div className="profile-container">
                  
                  <img src={currentUser.avatar_url} alt="" className="profile" />
                  <div className="profile-info">
                    <h3>
                      {currentUser.name ? currentUser.name : currentUser.login}
                    </h3>
                    <p>@{currentUser.login}</p>
                    <p>{currentUser.bio}</p>
                    <p>{}</p>
                  </div>
                </div>
                <hr />
              </>) : (<p>User not found</p>)}

              {repos?.length ? (
                <div>
                  <h4>Repositories: {repos?.length}</h4>
                  {repos.map(repo => (
                    <ItemList title={repo.name} description={repo.description} key={repo.id} />
                  ))}
                  
                </div>
              ) : <p>No repos found</p>}
            </div>
        </div>

      </div>
    </div>
  );
}

export default App;
