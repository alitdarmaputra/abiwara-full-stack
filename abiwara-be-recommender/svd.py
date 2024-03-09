import numpy as np

class SVD():
    def __init__(self, n_factors=100, n_epochs=20, init_mean=0,
                 init_std_dev=.1, lr=.005,
                 reg=.02, verbose=False):
        
        self.n_factors = n_factors
        self.n_epochs = n_epochs
        self.init_mean = init_mean
        self.init_std_dev = init_std_dev
        self.verbose=verbose
        self.lr = lr
        self.reg = reg
    
    def fit(self, trainset):
        self.trainset = trainset

        # Initialise baselines
        self.bu = self.bi = None

        rng = np.random.mtrand._rand


        n_factors = self.n_factors
        lr = self.lr
        reg = self.reg
        global_mean = self.trainset.global_mean

        # user biases
        bu = np.zeros(trainset.n_users, dtype=np.double)
        # item biases
        bi = np.zeros(trainset.n_items, dtype=np.double)
        # user factors
        pu = np.random.normal(loc=self.init_mean, scale=self.init_std_dev, size=(trainset.n_users, n_factors))
        # item factors
        qi = np.random.normal(loc=self.init_mean, scale=self.init_std_dev, size=(trainset.n_items, n_factors))
        
        for current_epoch in range(self.n_epochs):
            if self.verbose:
                print("Processing epoch {}".format(current_epoch))

            for u, i, r in trainset.all_ratings():
                # compute current error
                dot = 0  # <q_i, p_u>
                for f in range(n_factors):
                    dot += qi[i, f] * pu[u, f]
                err = r - (global_mean + bu[u] + bi[i] + dot)

                bu[u] += lr * (err - reg * bu[u])
                bi[i] += lr * (err - reg * bi[i])

                # update factors
                for f in range(n_factors):
                    puf = pu[u, f]
                    qif = qi[i, f]
                    pu[u, f] += lr * (err * qif - reg * puf)
                    qi[i, f] += lr * (err * puf - reg * qif)
        
        self.bu = np.asarray(bu)
        self.bi = np.asarray(bi)
        self.pu = np.asarray(pu)
        self.qi = np.asarray(qi)

        return self
  
    def estimate(self, u, i):
        known_user = self.trainset.knows_user(u)
        known_item = self.trainset.knows_item(i)

        est = self.trainset.global_mean

        if known_user:
            est += self.bu[u]

        if known_item:
            est += self.bi[i]

        if known_user and known_item:
            est += np.dot(self.qi[i], self.pu[u])

        return est
    
    def predict(self, testset):
        pred = []

        for index, row in testset.iterrows():
            user_id = row['user_id']
            item_id = row['book_id']
          
            inner_uid = self.trainset.to_inner_uid(user_id)
            inner_iid = self.trainset.to_inner_iid(item_id)
            
            est = self.estimate(inner_uid, inner_iid)
            
            lower_bound, higher_bound = self.trainset.rating_scale
            est = min(higher_bound, est)
            est = max(lower_bound, est)
            
            pred.append(est)
        
        return pred
