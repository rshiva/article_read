'use strict';
  document.getElementById('all_read').onclick = function() {
    GetUrls();
  }

function GetUrls() { 
  chrome.tabs.query({'active': true, 'currentWindow': true},
     function(tabs){
        var url = tabs[0].url;
        var title = tabs[0].title;
        var bookmarkAdded = addBookmark(url, title);
        if(bookmarkAdded){
          chrome.browserAction.setBadgeText({text: String(destFolder.children.length+1)})
        }
     }
  );
}
var destFolder, bookmarkBar, finalMessage;

chrome.bookmarks.getTree(findOrCreateDestinationFolder);

function findOrCreateDestinationFolder(rootNodes)
{
    var rootNode;
    if(rootNodes.length>0)
    {
        rootNode = rootNodes[0];
    }
    destFolder = findBookmarksFolder(rootNode, "Reead Bookmarks");
    console.log(destFolder)
    if(!destFolder)
    {
        bookmarkBar = findBookmarksFolder(rootNode,"Bookmarks Bar");
        chrome.bookmarks.create({parentId:bookmarkBar?bookmarkBar.id:"1",title:"Reead Bookmarks"}, function(bmk){
            destFolder=bmk;
            finalMessage += " Destination Folder created under Bookmarks bar.\n"
        });
    }
    else
    {
         finalMessage += " Destination Folder exists.\n"
    }
}

function findBookmarksFolder(rootNode, searchString)
{
    if(rootNode.url)
    {
        return null;
    }
    else if(rootNode.title.indexOf(searchString)>=0)
    {
        return rootNode;
    }
    for(var i=0; i<rootNode.children.length; i++)
    {
        var dest = findBookmarksFolder(rootNode.children[i], searchString);
        if(dest)
        {
            return dest;
        }
    }
    return null;
}

function addBookmark(bookmarkURL, bookmarktitle)
{
    console.log(destFolder,bookmarkURL,bookmarkURL)
    if(destFolder)
    {
        if(!findAlreadyBookMarked(destFolder,bookmarkURL)){
          chrome.bookmarks.create({title: bookmarktitle, parentId: destFolder.id, url: bookmarkURL});
          finalMessage += " Added bookmark.\n";
          return true
        }else
        {
          finalMessage += " Url Already Added to bookmark.\n";
        }
    }
    else
    {
        finalMessage += " Could not add bookmark.\n";
    }
    alert(finalMessage);
}

function findAlreadyBookMarked(destFolder, url){
  for(var i=0; i < destFolder.children.length; i++){
    if(destFolder.children[i].url === url)
      return true;
  }
}


