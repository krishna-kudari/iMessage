/**
 * Prisma Panic Attack:--
 * when using incognito or inPrivate window 
 * resolved: ❌
 * */ 

/**
 * fetch is not deffined:--
 * at next-auth/client/**util.js 
 * when next-auth is used outside next-api rotes 
 * it means node doesn't have fetch defined outof the box but it is there in browser and nextjs has a plyfill for fetch but server is running on node run time
 * resolved: ✅
 * hacks: # update node to version 18 it has fetch implemented
 *        # attch fetch from node-fetch package to globalThis (dynamically import fetch)
 */